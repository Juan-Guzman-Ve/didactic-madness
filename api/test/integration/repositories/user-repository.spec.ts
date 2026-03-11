import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { AppModule } from '../../../src/app.module';
import { UserRepository } from '../../../src/infra/database/repositories/user.repository';
import { UserTestFactory } from '../../helpers';

describe('UserRepository - Simplified with Factory', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let userRepository: UserRepository;

  let createdUserIds: string[] = [];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Get repository and dataSource instances
    dataSource = app.get(DataSource);
    userRepository = app.get(UserRepository);
  });

  afterEach(async () => {
    // Clean up test data after each test
    if (createdUserIds.length > 0) {
      await userRepository.deleteByIds(createdUserIds);
      createdUserIds = [];
    }
  });

  afterAll(async () => {
    // Close connections
    await dataSource.destroy();
    await app.close();
  });

  describe('Basic CRUD Operations', () => {
    it('should create and retrieve a user', async () => {
      // Arrange - Create test user with factory
      const newUser = new UserTestFactory()
        .withEmail('john.doe@example.com')
        .withName('John', 'Doe')
        .active()
        .build();

      // Act - Create user
      const created = await userRepository.create(newUser);
      createdUserIds.push(created.id);

      // Retrieve user
      const retrieved = await userRepository.findById(created.id);

      // Assert
      expect(retrieved).toBeDefined();
      expect(retrieved?.email).toBe('john.doe@example.com');
      expect(retrieved?.firstName).toBe('John');
      expect(retrieved?.lastName).toBe('Doe');
      expect(retrieved?.status).toBe('Active');
    });

    it('should update user details', async () => {
      // Arrange - Create a user
      const user = UserTestFactory.create();
      const created = await userRepository.create(user);
      createdUserIds.push(created.id);

      // Act - Update user
      const updated = await userRepository.updateById(created.id, {
        firstName: 'Jane',
        lastName: 'Smith',
      });

      // Assert
      expect(updated.firstName).toBe('Jane');
      expect(updated.lastName).toBe('Smith');
      expect(updated.email).toBe(user.email); // Unchanged
    });

    it('should delete a user', async () => {
      // Arrange
      const user = UserTestFactory.create();
      const created = await userRepository.create(user);

      // Act
      await userRepository.deleteById(created.id);

      // Assert - User should no longer exist
      const found = await userRepository.findById(created.id);
      expect(found).toBeNull();
    });
  });

  describe('Custom Repository Methods', () => {
    it('should find user by email', async () => {
      // Arrange
      const email = `unique-${Date.now()}@example.com`;
      const user = UserTestFactory.create({ email });
      const created = await userRepository.create(user);
      createdUserIds.push(created.id);

      // Act
      const found = await userRepository.findByEmail(email);

      // Assert
      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
      expect(found?.email).toBe(email);
    });

    it('should check if email exists', async () => {
      // Arrange
      const email = `exists-${Date.now()}@example.com`;
      const user = UserTestFactory.create({ email });
      const created = await userRepository.create(user);
      createdUserIds.push(created.id);

      // Act & Assert
      expect(await userRepository.emailExists(email)).toBe(true);
      expect(await userRepository.emailExists('nonexistent@example.com')).toBe(false);
    });

    it('should find only active users', async () => {
      // Arrange - Create active and inactive users
      const activeUser = new UserTestFactory().active().build();
      const inactiveUser = new UserTestFactory().inactive().build();

      const created1 = await userRepository.create(activeUser);
      const created2 = await userRepository.create(inactiveUser);
      createdUserIds.push(created1.id, created2.id);

      // Act
      const activeUsers = await userRepository.findActiveUsers();

      // Assert
      const foundActive = activeUsers.find(u => u.id === created1.id);
      const foundInactive = activeUsers.find(u => u.id === created2.id);

      expect(foundActive).toBeDefined();
      expect(foundInactive).toBeUndefined();
    });
  });

  describe('Batch Operations', () => {
    it('should create multiple users at once', async () => {
      // Arrange
      const users = UserTestFactory.createMany(3);

      // Act - Use createMany if available, or loop
      const createdUsers = [];
      for (const user of users) {
        const created = await userRepository.create(user);
        createdUsers.push(created);
        createdUserIds.push(created.id);
      }

      // Assert
      expect(createdUsers).toHaveLength(3);
      for (const created of createdUsers) {
        const found = await userRepository.findById(created.id);
        expect(found).toBeDefined();
      }
    });

    it('should count users correctly', async () => {
      // Arrange
      const countBefore = await userRepository.count();

      const users = UserTestFactory.createMany(2);
      for (const user of users) {
        const created = await userRepository.create(user);
        createdUserIds.push(created.id);
      }

      // Act
      const countAfter = await userRepository.count();

      // Assert
      expect(countAfter).toBe(countBefore + 2);
    });
  });

  describe('Edge Cases', () => {
    it('should return null for non-existent user', async () => {
      // Act
      const found = await userRepository.findById('non-existent-id-12345');

      // Assert
      expect(found).toBeNull();
    });

    it('should handle concurrent operations', async () => {
      // Arrange
      const users = UserTestFactory.createMany(5);

      // Act - Create users concurrently
      const promises = users.map(user => userRepository.create(user));
      const results = await Promise.all(promises);

      results.forEach(r => createdUserIds.push(r.id));

      // Assert - All users should be created
      expect(results).toHaveLength(5);

      // Verify all users exist in database
      const verifyPromises = results.map(r => userRepository.findById(r.id));
      const verified = await Promise.all(verifyPromises);

      expect(verified.every(v => v !== null)).toBe(true);
    });
  });
});
