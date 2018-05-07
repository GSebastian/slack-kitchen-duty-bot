rm index.zip 
cd handle-actions-immediately 
zip "../index.zip" * -r -X
cd .. 
aws lambda update-function-code --function-name slack-kitchen-duty-bot-handle-actions-immediately --zip-file fileb://index.zip
