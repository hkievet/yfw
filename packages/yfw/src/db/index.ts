import { Client, Connection } from "pg";

const HOST = "localhost";
const PORT = 5432;
const USERNAME = "yfw";
const PW = "yfw_password";

let client = new Client({
  host: HOST,
  port: PORT,
  user: USERNAME,
  password: PW,
});

export async function connect(): Promise<void> {
  if (!client) {
    client = new Client({
      host: HOST,
      port: PORT,
      user: USERNAME,
      password: PW,
    });
  }
  try {
    await client.connect();
    return;
  } catch (e) {
    console.error("Error connectiong");
    throw e;
  }
}

export async function end(): Promise<void> {
  try {
    await client.end();
    client = new Client({
      host: HOST,
      port: PORT,
      user: USERNAME,
      password: PW,
    });
    return;
  } catch (e) {
    console.error("Error connectiong");
    throw e;
  }
}

export async function testNow(): Promise<string> {
  await connect();
  const data = await client.query(`SELECT NOW()`);
  await end();
  return data.rows[0].now;
}

export async function initDb(): Promise<void> {
  await createVideoTable();
}

export async function createVideoTable(): Promise<void> {
  await connect();
  const sql = `CREATE TABLE IF NOT EXISTS video (
        id serial primary key,
        filepath text,
        name text,
        length bigint,
        source_url text UNIQUE,
        status text
    );`;
  await client.query(sql);
  return await end();
}

interface Video {
  id: number;
  filepath: string;
  name: string;
  length: number;
  sourceUrl: string;
  status: "pending" | "downloading" | "finished";
}

export async function addNewVideoUpload(video: Partial<Video>): Promise<void> {
  await connect();
  const sql = `INSERT INTO video (filepath, name, source_url, status) VALUES (
        $1,
        $2,
        $3,
        $4
    );`;
  const args = [video.filepath, video.name, video.sourceUrl, video.status];
  const result = await client.query(sql, args);
  return await end();
}

export async function updateVideoFinishedDownloading(
  video: Partial<Video>
): Promise<void> {
  await connect();
  const sql = `UPDATE video 
  SET length = $1, status = 'finished'
  WHERE sourceURL=$2`;
  const args = [video.length, video.sourceUrl];
  const result = await client.query(sql, args);
  return await end();
}

export async function dropVideoTable(): Promise<void> {
  const sql = `DROP TABLE IF EXISTS video`;
  await client.connect();
  await client.query(sql);
  await client.end();
}
