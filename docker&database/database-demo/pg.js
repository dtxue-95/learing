import pg from 'pg'

const pgConfig = {
    host: 'localhost',
    port: 5432,
    database: 'jiuyu-test',
    user: 'postgres',
    password: 'jiuyu',
}

// 连接数据库
const pool = new pg.Pool(pgConfig);

pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack);
    }
    // 做其他的处理
    console.log('Connected to database 成功');
    const sql = "SELECT * FROM docs"
    client.query(sql, (err, result) => {
        release();
        if (err) {
            return console.error('Error executing query', err.stack);
        }
        console.log('Query result:', result.rows);
    });
});


















