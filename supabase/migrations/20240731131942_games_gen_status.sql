-- Create enum type status_enum
CREATE TYPE status_enum AS ENUM ('pending', 'success', 'failure');

-- Add column gen_status to games table with default value
ALTER TABLE games
ADD COLUMN gen_status status_enum DEFAULT 'pending';

-- Ensure the gen_status column is not null
ALTER TABLE games
ALTER COLUMN gen_status SET NOT NULL;

-- Create a trigger function to set gen_status based on has_to_play
CREATE OR REPLACE FUNCTION update_gen_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.how_to_play IS NOT NULL THEN
        NEW.gen_status := 'success';
    ELSE
        NEW.gen_status := 'pending';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger to call the function before insert or update
CREATE TRIGGER update_gen_status
BEFORE INSERT OR UPDATE ON games
FOR EACH ROW
EXECUTE PROCEDURE update_gen_status();
