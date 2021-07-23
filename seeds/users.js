exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('notes').del().then(() => {
    return knex('users').del()
      .then(function () {
        // Inserts seed entries
        return knex('users').insert([{
            username: "gabe",
            password: '6969'
          },
          {
            username: "zach",
            password: "9696"
          },

        ]).then(() => {
          return knex('notes').insert([{
              content: "hello",
              user_id: 1
            },
            {
              content: "world",
              user_id: 2
            }
          ]);
        });
      });
  })

};