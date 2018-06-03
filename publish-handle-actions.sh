rm index.zip

# Moving the environment files into the lambda function folder
cp environment.js handle-actions/environment.js
cp kitchen-duty-423cd-firebase-adminsdk-cvvco-56cbd3f1b5.json handle-actions/kitchen-duty-423cd-firebase-adminsdk-cvvco-56cbd3f1b5.json
cp kitchen-duty-test-firebase-adminsdk-dxpbl-cf1bc3eb3b.json handle-actions/kitchen-duty-test-firebase-adminsdk-dxpbl-cf1bc3eb3b.json

cd handle-actions 
zip "../index.zip" * -r -X
cd .. 
aws lambda update-function-code --function-name slack-kitchen-duty-bot-handle-actions --zip-file fileb://index.zip

# Cleaning up the environment files
rm handle-actions/environment.js
rm handle-actions/kitchen-duty-423cd-firebase-adminsdk-cvvco-56cbd3f1b5.json
rm handle-actions/kitchen-duty-test-firebase-adminsdk-dxpbl-cf1bc3eb3b.json
