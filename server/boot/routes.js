module.exports = function (app) {
  var router = app.loopback.Router();
  router.get('/temp', function (req, res) {
    var cookies = req.headers.cookie.split(';');
    console.log("cookie : ", cookies);
    var tkn_val = cookies[1].split('=');
    console.log("access_token : ", tkn_val[0]);

    if (tkn_val[0] != 'access_token') {
      res.redirect("/");

    }
  })

  router.get('/auth', function (req, res) {

    var Sysuser = app.models.Sysuser;
    var AccessRight = app.models.AccessRight;
    var Role = app.models.Role;
    if (req.headers.cookie == null) {
      res.redirect('/');
    } else {
      var token = "";
      var cookies = req.headers.cookie.split(';');
      for (var tkn of cookies) {
        var tkn_val = tkn.split('=');
        if (tkn_val[0] == 'access_token') {
          token = tkn_val[1];
          break;
        }

      }

      if (token != "") {
        console.log(token);

        Sysuser.relations.accessTokens.modelTo.findById(token, function (err, tokn) {
          if (err) {
            console.log("error finding token");
          }


          Sysuser.findById(tokn.userId, function (errs, user) {
            if (errs) {
              console.log("unable to find user");

            }
            // console.log("user : ",user);
            AccessRight.findOne({ where: { userid: { like: user.id.toString() } } }, function (err3, rights) {
              if (err3) {
                console.log("error finding Rights: ", err3);
              }
              // console.log("rights :",rights);

              Role.getRoles({
                principalType: "USER",
                principalId: user.id
              }, function (err4, role) {
                if (err4) {
                  console.log("error finding Role");
                } else {
                  console.log("role : ", role);
                  Role.findById(role[2], function (err5, roleObj) {
                    // console.log("roleObj : ",roleObj);
                    user.employees(function (err, emp) {
                      // console.log("user : ",emp);

                      console.log("user :", user);
                      console.log("role : ", roleObj)
                      res.render('fixed',
                        {
                          user: JSON.stringify(user),
                          access: JSON.stringify(rights.rights),
                          role: JSON.stringify(roleObj),
                          empRec: JSON.stringify(emp)
                        });

                    });
                  });

                }

              });

            });
          });
        });
      } else {
        res.redirect('/');
      }
    }

  });

  router.get('/logout', function (req, res) {
    var Sysuser = app.models.Sysuser;
    var cookies = req.headers.cookie.split(';');
    var token = "";
    for (var tkn of cookies) {
      var tkn_val = tkn.split('=');
      if (tkn_val[0] == 'access_token') {
        // res.status(200).clearCookie('access_token',{
        //   path:'/'
        // });
        token = tkn_val[1];
        break;
      }

    }

    Sysuser.relations.accessTokens.modelTo.findById(token, function (err, tokn) {
      if (err) {
        console.log("error finding token");
      }
      Sysuser.findById(tokn.userId, function (errs, user) {
        if (errs) {
          console.log("unable to find user");

        }
        user.accessTokens.destroyAll();
      });
    });


    res.redirect('/');
  });
  app.use(router);
};
