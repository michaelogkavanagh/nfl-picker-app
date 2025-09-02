// ===== Lambda Function 1: Save Picks =====
// Function name: nfl-picker-save-picks
// Description: Saves user picks to DynamoDB

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
    // Enable CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
    };
    
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }
    
    try {
        const body = JSON.parse(event.body);
        const { week, member, picks, timestamp } = body;
        
        if (!week || !member || !picks) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'Missing required fields: week, member, picks'
                })
            };
        }
        
        // Save picks to DynamoDB
        const params = {
            TableName: 'nfl-picker',
            Item: {
                pk: `WEEK#${week}`,
                sk: `MEMBER#${member}`,
                picks: picks,
                timestamp: timestamp,
                type: 'PICKS'
            }
        };
        
        await dynamodb.put(params).promise();
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Picks saved successfully'
            })
        };
        
    } catch (error) {
        console.error('Error saving picks:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: 'Internal server error'
            })
        };
    }
};