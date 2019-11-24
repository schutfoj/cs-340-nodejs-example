CREATE TABLE IF NOT EXISTS `twit` (
    `id` INT NOT NULL,
    `author` VARCHAR(32) NOT NULL,
    `text` VARCHAR(280) NOT NULL,
    `date_created` DATETIME NOT NULL,

    PRIMARY KEY (`id`)
);