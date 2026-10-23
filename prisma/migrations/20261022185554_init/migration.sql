-- CreateTable
CREATE TABLE `technologies` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(60) NOT NULL,
    `slug` VARCHAR(60) NOT NULL,
    `category` ENUM('FRONTEND', 'BACKEND', 'DATABASE', 'DEVOPS', 'TOOL') NOT NULL,
    `iconKey` VARCHAR(60) NULL,
    `showInAbout` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `technologies_name_key`(`name`),
    UNIQUE INDEX `technologies_slug_key`(`slug`),
    INDEX `technologies_category_sortOrder_idx`(`category`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `projects` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(120) NOT NULL,
    `title` VARCHAR(120) NOT NULL,
    `summary` VARCHAR(280) NOT NULL,
    `description` TEXT NULL,
    `coverImage` VARCHAR(255) NOT NULL,
    `coverAlt` VARCHAR(200) NOT NULL,
    `coverWidth` INTEGER NOT NULL,
    `coverHeight` INTEGER NOT NULL,
    `coverBlur` TEXT NULL,
    `liveUrl` VARCHAR(255) NULL,
    `repoUrl` VARCHAR(255) NULL,
    `role` VARCHAR(120) NULL,
    `client` VARCHAR(120) NULL,
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `published` BOOLEAN NOT NULL DEFAULT false,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `completedAt` DATE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `projects_slug_key`(`slug`),
    INDEX `projects_published_featured_sortOrder_idx`(`published`, `featured`, `sortOrder`),
    INDEX `projects_published_sortOrder_idx`(`published`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `experiences` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('WORK', 'EDUCATION', 'CERTIFICATION') NOT NULL,
    `role` VARCHAR(120) NOT NULL,
    `organization` VARCHAR(120) NOT NULL,
    `location` VARCHAR(120) NULL,
    `url` VARCHAR(255) NULL,
    `startDate` DATE NOT NULL,
    `endDate` DATE NULL,
    `description` TEXT NULL,
    `highlights` JSON NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `experiences_type_startDate_idx`(`type`, `startDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contact_messages` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(254) NOT NULL,
    `subject` VARCHAR(150) NULL,
    `message` TEXT NOT NULL,
    `status` ENUM('NEW', 'READ', 'REPLIED', 'ARCHIVED', 'SPAM') NOT NULL DEFAULT 'NEW',
    `ipHash` CHAR(64) NULL,
    `userAgent` VARCHAR(255) NULL,
    `notifiedAt` DATETIME(3) NULL,
    `notifyError` VARCHAR(500) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `contact_messages_status_createdAt_idx`(`status`, `createdAt`),
    INDEX `contact_messages_ipHash_createdAt_idx`(`ipHash`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ProjectToTechnology` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ProjectToTechnology_AB_unique`(`A`, `B`),
    INDEX `_ProjectToTechnology_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ExperienceToTechnology` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ExperienceToTechnology_AB_unique`(`A`, `B`),
    INDEX `_ExperienceToTechnology_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_ProjectToTechnology` ADD CONSTRAINT `_ProjectToTechnology_A_fkey` FOREIGN KEY (`A`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProjectToTechnology` ADD CONSTRAINT `_ProjectToTechnology_B_fkey` FOREIGN KEY (`B`) REFERENCES `technologies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ExperienceToTechnology` ADD CONSTRAINT `_ExperienceToTechnology_A_fkey` FOREIGN KEY (`A`) REFERENCES `experiences`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ExperienceToTechnology` ADD CONSTRAINT `_ExperienceToTechnology_B_fkey` FOREIGN KEY (`B`) REFERENCES `technologies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
