// ===== Lambda Function 3: Save Results =====
// Function name: nfl-picker-save-results
// Description: Saves game results to DynamoDB

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
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
        const { week, results, timestamp } = body;
        
        if (!week || !results) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'Missing required fields: week, results'
                })
            };
        }
        
        // Save results to DynamoDB
        const params = {
            TableName: 'nfl-picker',
            Item: {
                pk: `WEEK#${week}`,
                sk: 'RESULTS',
                results: results,
                timestamp: timestamp,
                type: 'RESULTS'
            }
        };
        
        await dynamodb.put(params).promise();
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Results saved successfully'
            })
        };
        
    } catch (error) {
        console.error('Error saving results:', error);
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

