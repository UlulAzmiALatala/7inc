<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Skip stored procedures for SQLite (not supported)
        // This migration is only for MySQL
        if (DB::connection()->getDriverName() === 'sqlite') {
            return;
        }

        // Procedure 1: Calculate SPK for Job Applicants
        $procedureJob = "
        CREATE PROCEDURE sp_calculate_spk_job(IN p_job_vacancy_id BIGINT)
        BEGIN
            DECLARE v_weight_sum DECIMAL(5,2);
            
            -- Validate: Check if criteria weights sum to 100%
            SELECT SUM(weight) INTO v_weight_sum FROM spk_criteria WHERE type = 'job' AND is_active = TRUE;
            
            IF v_weight_sum IS NULL OR v_weight_sum != 100.00 THEN
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'ERROR: Total bobot kriteria harus 100%.';
            END IF;

            -- Create temporary table untuk normalisasi
            DROP TEMPORARY TABLE IF EXISTS temp_normalized_job;
            CREATE TEMPORARY TABLE temp_normalized_job (
                applicant_id BIGINT,
                final_score DECIMAL(10,4)
            );

            -- Get max values untuk normalisasi (benefit criteria)
            SELECT 
                MAX(education_score), MAX(experience_score), MAX(skill_score), MAX(interview_score), MAX(attitude_score)
            INTO 
                @max_education, @max_experience, @max_skill, @max_interview, @max_attitude
            FROM job_applicants 
            WHERE job_vacancy_id = p_job_vacancy_id;

            -- Handle division by zero
            SET @max_education = IF(@max_education = 0, 1, @max_education);
            SET @max_experience = IF(@max_experience = 0, 1, @max_experience);
            SET @max_skill = IF(@max_skill = 0, 1, @max_skill);
            SET @max_interview = IF(@max_interview = 0, 1, @max_interview);
            SET @max_attitude = IF(@max_attitude = 0, 1, @max_attitude);

            -- Get weights dari spk_criteria
            SELECT weight/100 INTO @w_education FROM spk_criteria WHERE type='job' AND criteria_field='education_score' AND is_active=1 LIMIT 1;
            SELECT weight/100 INTO @w_experience FROM spk_criteria WHERE type='job' AND criteria_field='experience_score' AND is_active=1 LIMIT 1;
            SELECT weight/100 INTO @w_skill FROM spk_criteria WHERE type='job' AND criteria_field='skill_score' AND is_active=1 LIMIT 1;
            SELECT weight/100 INTO @w_interview FROM spk_criteria WHERE type='job' AND criteria_field='interview_score' AND is_active=1 LIMIT 1;
            SELECT weight/100 INTO @w_attitude FROM spk_criteria WHERE type='job' AND criteria_field='attitude_score' AND is_active=1 LIMIT 1;

            -- Normalize & calculate final_score (V_i = Σ w_j × r_ij)
            INSERT INTO temp_normalized_job (applicant_id, final_score)
            SELECT id,
            (
                (@w_education * (education_score / @max_education)) +
                (@w_experience * (experience_score / @max_experience)) +
                (@w_skill * (skill_score / @max_skill)) +
                (@w_interview * (interview_score / @max_interview)) +
                (@w_attitude * (attitude_score / @max_attitude))
            ) AS final_score
            FROM job_applicants
            WHERE job_vacancy_id = p_job_vacancy_id;

            -- Update final_score ke table utama
            UPDATE job_applicants ja
            INNER JOIN temp_normalized_job tn ON ja.id = tn.applicant_id
            SET ja.final_score = tn.final_score;

            -- Calculate ranking (1 = highest score)
            SET @rank = 0;
            -- Menggunakan temporary table untuk ranking karena MySQL tidak support update table yg sama di subquery
            DROP TEMPORARY TABLE IF EXISTS temp_ranking_job;
            CREATE TEMPORARY TABLE temp_ranking_job AS
            SELECT id, ROW_NUMBER() OVER (ORDER BY final_score DESC) as new_ranking
            FROM job_applicants
            WHERE job_vacancy_id = p_job_vacancy_id;

            UPDATE job_applicants ja
            INNER JOIN temp_ranking_job tr ON ja.id = tr.id
            SET ja.ranking = tr.new_ranking;

            -- Cleanup
            DROP TEMPORARY TABLE IF EXISTS temp_normalized_job;
            DROP TEMPORARY TABLE IF EXISTS temp_ranking_job;

            -- Log activity
            INSERT INTO activity_logs (user_id, action_type, entity_type, entity_id, description, created_at, updated_at)
            VALUES (NULL, 'calculate_spk', 'JobVacancy', p_job_vacancy_id, CONCAT('SPK SAW calculated for job_vacancy_id: ', p_job_vacancy_id), NOW(), NOW());
        END
        ";

        // Procedure 2: Calculate SPK for Internship Applicants
        $procedureInternship = "
        CREATE PROCEDURE sp_calculate_spk_internship(IN p_internship_id BIGINT)
        BEGIN
            DECLARE v_weight_sum DECIMAL(5,2);
            
            -- Validate weights
            SELECT SUM(weight) INTO v_weight_sum FROM spk_criteria WHERE type = 'internship' AND is_active = TRUE;
            
            IF v_weight_sum IS NULL OR v_weight_sum != 100.00 THEN
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'ERROR: Total bobot kriteria magang harus 100%';
            END IF;

            -- Temporary table
            DROP TEMPORARY TABLE IF EXISTS temp_normalized_internship;
            CREATE TEMPORARY TABLE temp_normalized_internship (
                applicant_id BIGINT,
                final_score DECIMAL(10,4)
            );

            -- Get max values
            SELECT 
                MAX(gpa_score), MAX(skill_score), MAX(motivation_score), MAX(availability_score), MAX(communication_score)
            INTO 
                @max_gpa, @max_skill, @max_motivation, @max_availability, @max_communication
            FROM internship_applicants
            WHERE internship_id = p_internship_id;

            -- Handle division by zero
            SET @max_gpa = IF(@max_gpa = 0, 1, @max_gpa);
            SET @max_skill = IF(@max_skill = 0, 1, @max_skill);
            SET @max_motivation = IF(@max_motivation = 0, 1, @max_motivation);
            SET @max_availability = IF(@max_availability = 0, 1, @max_availability);
            SET @max_communication = IF(@max_communication = 0, 1, @max_communication);

            -- Get weights
            SELECT weight/100 INTO @w_gpa FROM spk_criteria WHERE type='internship' AND criteria_field='gpa_score' AND is_active=1 LIMIT 1;
            SELECT weight/100 INTO @w_skill FROM spk_criteria WHERE type='internship' AND criteria_field='skill_score' AND is_active=1 LIMIT 1;
            SELECT weight/100 INTO @w_motivation FROM spk_criteria WHERE type='internship' AND criteria_field='motivation_score' AND is_active=1 LIMIT 1;
            SELECT weight/100 INTO @w_availability FROM spk_criteria WHERE type='internship' AND criteria_field='availability_score' AND is_active=1 LIMIT 1;
            SELECT weight/100 INTO @w_communication FROM spk_criteria WHERE type='internship' AND criteria_field='communication_score' AND is_active=1 LIMIT 1;

            -- Calculate
            INSERT INTO temp_normalized_internship (applicant_id, final_score)
            SELECT id,
            (
                (@w_gpa * (gpa_score / @max_gpa)) +
                (@w_skill * (skill_score / @max_skill)) +
                (@w_motivation * (motivation_score / @max_motivation)) +
                (@w_availability * (availability_score / @max_availability)) +
                (@w_communication * (communication_score / @max_communication))
            ) AS final_score
            FROM internship_applicants
            WHERE internship_id = p_internship_id;

            -- Update final score
            UPDATE internship_applicants ia
            INNER JOIN temp_normalized_internship tn ON ia.id = tn.applicant_id
            SET ia.final_score = tn.final_score;

            -- Ranking
            DROP TEMPORARY TABLE IF EXISTS temp_ranking_internship;
            CREATE TEMPORARY TABLE temp_ranking_internship AS
            SELECT id, ROW_NUMBER() OVER (ORDER BY final_score DESC) as new_ranking
            FROM internship_applicants
            WHERE internship_id = p_internship_id;

            UPDATE internship_applicants ia
            INNER JOIN temp_ranking_internship tr ON ia.id = tr.id
            SET ia.ranking = tr.new_ranking;

            -- Cleanup
            DROP TEMPORARY TABLE IF EXISTS temp_normalized_internship;
            DROP TEMPORARY TABLE IF EXISTS temp_ranking_internship;

            -- Log activity
            INSERT INTO activity_logs (user_id, action_type, entity_type, entity_id, description, created_at, updated_at)
            VALUES (NULL, 'calculate_spk', 'Internship', p_internship_id, CONCAT('SPK SAW calculated for internship_id: ', p_internship_id), NOW(), NOW());
        END
        ";

        DB::unprepared("DROP PROCEDURE IF EXISTS sp_calculate_spk_job");
        DB::unprepared($procedureJob);

        DB::unprepared("DROP PROCEDURE IF EXISTS sp_calculate_spk_internship");
        DB::unprepared($procedureInternship);
    }

    public function down(): void
    {
        // Skip for SQLite
        if (DB::connection()->getDriverName() === 'sqlite') {
            return;
        }

        DB::unprepared("DROP PROCEDURE IF EXISTS sp_calculate_spk_job");
        DB::unprepared("DROP PROCEDURE IF EXISTS sp_calculate_spk_internship");
    }
};
