import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';

describe('Database Connection', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = app.get(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  it('should connect to database successfully', async () => {
    expect(dataSource.isInitialized).toBe(true);
    
    const result = await dataSource.query('SELECT 1 as connected');
    expect(result[0].connected).toBe(1);
  });
});
