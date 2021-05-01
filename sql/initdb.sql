CREATE TABLE `SearchHistory` (
  `search_id` char(32) PRIMARY KEY,
  `content` varchar(255) character set utf8mb4 NOT NULL
);

CREATE TABLE `SearchRef` (
  `search_id` char(32) ,
  `service_id` char(32) ,
  `priority` int,
  PRIMARY KEY (`search_id`, `service_id`)
);

CREATE TABLE `Keyword` (
  `kw_id` char(32),
  `name` varchar(255) character set utf8mb4 NOT NULL,
  PRIMARY KEY (`kw_id`, `name`)
);

CREATE TABLE `KeywordRef` (
  `kw_id` char(32),
  `service_id` char(32),
  `score` Int(11),
  PRIMARY KEY (`kw_id`, `service_id`)
);

ALTER TABLE `SearchRef` ADD FOREIGN KEY (`search_id`) REFERENCES `SearchHistory` (`search_id`);

ALTER TABLE `KeywordRef` ADD FOREIGN KEY (`kw_id`) REFERENCES `Keyword` (`kw_id`);
