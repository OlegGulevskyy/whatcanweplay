create function incrementBy (x int, user_email varchar) 
returns void as
$$
  update profiles
  set credits_available = credits_available + x
  where email = user_email
$$ 
language sql volatile;

create function decrementBy (x int, user_email varchar) 
returns void as
$$
  update profiles
  set credits_available = credits_available - x
  where email = user_email
$$ 
language sql volatile;
