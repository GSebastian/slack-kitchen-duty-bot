rm index.zip 
cd display-actions 
zip "../index.zip" * -r -X
cd .. 
aws lambda update-function-code --function-name slack-kitchen-duty-bot-display-actions --zip-file fileb://index.zip --profile development@rolleragency.co.uk
