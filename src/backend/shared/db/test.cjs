const { Client } = require('pg'); 
const c = new Client({ connectionString: 'postgresql://postgres.zpvgzwzxakiqopgwhpbd:Satyaki%4029AS@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres', ssl: { rejectUnauthorized: false } }); 
c.connect()
 .then(() => c.query('CREATE TABLE IF NOT EXISTS test_tbl ( invoiceType TEXT UNIQUE )'))
 .then(() => c.query("INSERT INTO test_tbl (invoiceType) VALUES ('test') ON CONFLICT (invoiceType) DO NOTHING"))
 .then(console.log)
 .catch(console.error)
 .finally(() => c.end());
