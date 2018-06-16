rm index.zip
cd handle-actions 
zip "../index.zip" * -r -X
cd .. 
aws lambda update-function-code --function-name slack-kitchen-duty-bot-handle-actions --zip-file fileb://index.zip --profile development@rolleragency.co.uk
