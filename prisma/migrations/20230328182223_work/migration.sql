-- CreateTable
CREATE TABLE `Technology` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_TechnologyToWork` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_TechnologyToWork_AB_unique`(`A`, `B`),
    INDEX `_TechnologyToWork_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_TechnologyToWork` ADD CONSTRAINT `_TechnologyToWork_A_fkey` FOREIGN KEY (`A`) REFERENCES `Technology`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_TechnologyToWork` ADD CONSTRAINT `_TechnologyToWork_B_fkey` FOREIGN KEY (`B`) REFERENCES `Work`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
