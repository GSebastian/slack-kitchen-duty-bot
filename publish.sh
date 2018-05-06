rm index.zip 
cd lambda 
zip "../index.zip" * -r -X
cd .. 
aws lambda update-function-code --function-name slack-kitchen-duty-bot-get-team --zip-file fileb://index.zip
