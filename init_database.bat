@echo off

set PSQL_PATH="C:\Program Files\PostgreSQL\16\bin\psql.exe"
set PG_USER=postgres
set DB_NAME=athenium_dev_db
set PG_PASSWORD=1234
set PORT=5433
set PGPASSWORD=%PG_PASSWORD%
%PSQL_PATH% -U %PG_USER% -d %DB_NAME% -p %PORT% 

pause
