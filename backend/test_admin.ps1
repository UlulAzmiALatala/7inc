$baseUrl = "http://127.0.0.1:8001/api/admin"

# 1. Register Admin
$registerBody = @{
    name = "Test Admin"
    email = "testadmin@seveninc.com"
    password = "password"
    password_confirmation = "password"
    role = "super_admin"
} | ConvertTo-Json

try {
    $regResponse = Invoke-RestMethod -Uri "$baseUrl/register" -Method Post -Body $registerBody -ContentType "application/json" -ErrorAction Stop
    Write-Host "Admin Registered Successfully"
    Write-Host "Response: $($regResponse | ConvertTo-Json -Depth 5)"
    $token = $regResponse.token
} catch {
    Write-Host "Register failed. Error: $_"
    # Print detailed error if possible
    $_.Exception.Response.GetResponseStream() | %{ [System.IO.StreamReader]::new($_).ReadToEnd() }
    
    Write-Host "Trying login..."
    $loginBody = @{
        email = "testadmin@seveninc.com"
        password = "password"
    } | ConvertTo-Json
    
    try {
        $loginResponse = Invoke-RestMethod -Uri "$baseUrl/login" -Method Post -Body $loginBody -ContentType "application/json" -ErrorAction Stop
        $token = $loginResponse.token
        Write-Host "Login Successful"
    } catch {
        Write-Host "Login failed: $_"
        exit
    }
}

Write-Host "Token: $token"

# 2. Create Job Vacancy
$headers = @{
    Authorization = "Bearer $token"
}

$vacancyBody = @{
    title = "Backend Developer"
    description = "Develop backend systems"
    requirements = "PHP, Laravel"
    location = "Remote"
    job_type = "full-time"
    salary_range = "1000-2000"
    deadline = (Get-Date).AddDays(30).ToString("yyyy-MM-dd")
    google_form_url = "https://docs.google.com/forms/d/e/1FAIpQLSe"
} | ConvertTo-Json

Write-Host "Creating Vacancy..."
try {
    $vacancyResponse = Invoke-RestMethod -Uri "$baseUrl/vacancies" -Method Post -Headers $headers -Body $vacancyBody -ContentType "application/json" -ErrorAction Stop
    Write-Host "Vacancy Response: $($vacancyResponse.success)"
    $vacancyId = $vacancyResponse.data.id
    Write-Host "Vacancy ID: $vacancyId"
} catch {
    Write-Host "Create Vacancy Failed: $_"
    # Print error details if available
    $_.Exception.Response.GetResponseStream() | %{ [System.IO.StreamReader]::new($_).ReadToEnd() }
    exit
}

# 3. Create Applicant
$applicantBody = @{
    job_vacancy_id = $vacancyId
    name = "John Doe"
    email = "john@example.com"
    phone = "08123456789"
    education_score = 80
    experience_score = 85
    skill_score = 90
    interview_score = 88
    attitude_score = 95
} | ConvertTo-Json

Write-Host "Creating Applicant..."
try {
    $applicantResponse = Invoke-RestMethod -Uri "$baseUrl/applicants" -Method Post -Headers $headers -Body $applicantBody -ContentType "application/json" -ErrorAction Stop
    Write-Host "Applicant Response: $($applicantResponse.success)"
    Write-Host "Applicant Score: $($applicantResponse.data.final_score)"
    Write-Host "Applicant Ranking: $($applicantResponse.data.ranking)"
} catch {
    Write-Host "Create Applicant Failed: $_"
    $_.Exception.Response.GetResponseStream() | %{ [System.IO.StreamReader]::new($_).ReadToEnd() }
}
