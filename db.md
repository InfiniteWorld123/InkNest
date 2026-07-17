users {
  id int pk
  username string
  email string
  password_hash string
  bio text
  created_at datetime
}

posts {
  id int pk
  author_id int
  title string
  slug string
  content text
  status string
  published_at datetime
  created_at datetime
  updated_at datetime
}

comments {
  id int pk
  post_id int
  user_id int
  parent_id int
  content text
  created_at datetime
}

tags {
  id int pk
  name string
  slug string
}

post_tags {
  post_id int pk
  tag_id int pk
}

categories {
  id int pk
  name string
  slug string
}

post_categories {
  post_id int pk
  category_id int pk
}

likes {
  user_id int pk
  post_id int pk
  created_at datetime
}

bookmarks {
  user_id int pk
  post_id int pk
  created_at datetime
}

follows {
  follower_id int pk
  following_id int pk
  created_at datetime
}

post_views {
  id int pk
  post_id int
  user_id int
  viewed_at datetime
}

notifications {
  id int pk
  user_id int
  actor_id int
  post_id int
  comment_id int
  type string
  is_read boolean
  created_at datetime
}

posts.author_id > users.id

post_categories.post_id > posts.id 
post_categories.category_id  > categories.id 

post_tags.post_id > posts.id 
post_tags.tag_id  > tags.id 

bookmarks.post_id > posts.id 
bookmarks.user_id > users.id 

likes.post_id > posts.id
likes.user_id > users.id

comments.post_id > posts.id
comments.user_id > users.id
comments.parent_id > comments.id

follows.follower_id > users.id
follows.following_id > users.id

post_views.post_id > posts.id
post_views.user_id > users.id

notifications.user_id > users.id
notifications.actor_id > users.id
notifications.post_id > posts.id
notifications.comment_id > comments.id