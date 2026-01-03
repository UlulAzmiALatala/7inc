<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SpkCriteriaSeeder extends Seeder
{
    public function run(): void
    {
        // Kriteria Lowongan Kerja (Job)
        $jobCriteria = [
            ['type' => 'job', 'criteria_name' => 'Pendidikan', 'criteria_field' => 'education_score', 'weight' => 20],
            ['type' => 'job', 'criteria_name' => 'Pengalaman', 'criteria_field' => 'experience_score', 'weight' => 25],
            ['type' => 'job', 'criteria_name' => 'Keterampilan', 'criteria_field' => 'skill_score', 'weight' => 25],
            ['type' => 'job', 'criteria_name' => 'Interview', 'criteria_field' => 'interview_score', 'weight' => 20],
            ['type' => 'job', 'criteria_name' => 'Attitude', 'criteria_field' => 'attitude_score', 'weight' => 10],
        ];

        // Kriteria Magang (Internship)
        $internshipCriteria = [
            ['type' => 'internship', 'criteria_name' => 'IPK', 'criteria_field' => 'gpa_score', 'weight' => 20],
            ['type' => 'internship', 'criteria_name' => 'Keahlian', 'criteria_field' => 'skill_score', 'weight' => 25],
            ['type' => 'internship', 'criteria_name' => 'Motivasi', 'criteria_field' => 'motivation_score', 'weight' => 20],
            ['type' => 'internship', 'criteria_name' => 'Ketersediaan', 'criteria_field' => 'availability_score', 'weight' => 15],
            ['type' => 'internship', 'criteria_name' => 'Komunikasi', 'criteria_field' => 'communication_score', 'weight' => 20],
        ];

        foreach (array_merge($jobCriteria, $internshipCriteria) as $criteria) {
            DB::table('spk_criteria')->updateOrInsert(
                [
                    'type' => $criteria['type'],
                    'criteria_field' => $criteria['criteria_field']
                ],
                $criteria
            );
        }
    }
}
