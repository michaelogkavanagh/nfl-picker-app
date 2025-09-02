// ===== Lambda Function 4: Get Results =====
// Function name: nfl-picker-get-results
// Description: Retrieves results for a specific week

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
        const week = decodeURIComponent(event.pathParameters.week);
        
        // Get results for the week
        const params = {
            TableName: 'nfl-picker',
            Key: {
                pk: `WEEK#${week}`,
                sk: 'RESULTS'
            }
        };
        
        const result = await dynamodb.get(params).promise();
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                results: result.Item?.results || {}
            })
        };
        
    } catch (error) {
        console.error('Error getting results:', error);
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
