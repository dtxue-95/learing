import "reflect-metadata";
import { Photo } from "./entities/Photo.js";
import { DataSource } from "typeorm";
const dataSourceConfig = {
    type: "postgres",
    host: "127.0.0.1",
    port: 5432,
    username: "postgres",
    password: "jiuyu",
    database: "jiuyu-test",
    synchronize: true,
    logging: false,
    entities: [Photo],
};
const appDataSource = new DataSource(dataSourceConfig);
const test = async () => {
    await appDataSource.initialize();
    // 插入数据
    const photo = new Photo();
    photo.name = "九余";
    photo.description = "我是九余";
    photo.status = true;
    await appDataSource.manager.save(photo);
    // 或者使用 SQL
    const photoRes = await appDataSource.manager.query("SELECT * FROM photo");
    console.log(photoRes);
};
test();
