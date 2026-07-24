WITH missing_usernames AS (
	SELECT
		id,
		LEFT(
			COALESCE(
				NULLIF(
					TRIM(BOTH '.' FROM REGEXP_REPLACE(LOWER(name), '[^a-z0-9]+', '.', 'g')),
					''
				),
				'writer'
			),
			17
		) AS base,
		LEFT(LOWER(REGEXP_REPLACE(id, '[^a-zA-Z0-9]+', '', 'g')), 12) AS suffix
	FROM "user"
	WHERE username IS NULL OR TRIM(username) = ''
)
UPDATE "user" AS target
SET
	username = CONCAT(source.base, '.', source.suffix),
	updated_at = NOW()
FROM missing_usernames AS source
WHERE target.id = source.id;
