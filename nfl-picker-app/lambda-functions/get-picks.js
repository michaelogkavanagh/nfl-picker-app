// ===== Lambda Function 2: Get Picks =====
// Function name: nfl-picker-get-picks
// Description: Retrieves picks for a specific week

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
        
        // Query all picks for the week
        const params = {
            TableName: 'nfl-picker',
            KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk)',
            ExpressionAttributeValues: {
                ':pk': `WEEK#${week}`,
                ':sk': 'MEMBER#'
            }
        };
        
        const result = await dynamodb.query(params).promise();
        
        // Transform data into expected format
        const picks = {};
        result.Items.forEach(item => {
            const member = item.sk.replace('MEMBER#', '');
            picks[member] = {
                picks: item.picks,
                timestamp: item.timestamp
            };
        });
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                picks: picks
            })
        };
        
    } catch (error) {
        console.error('Error getting picks:', error);
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
