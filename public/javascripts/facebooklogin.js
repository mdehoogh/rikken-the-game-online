
FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
});

/*
// possible response from getLoginStatus
// status can be: - connected: logged in to Facebook and your app, - not_authorized: logged in to Facebook, not your app, - unknown
// authResponse is included when status equals connected, 
{
    status: 'connected',
    authResponse: {
        accessToken: '...',
        expiresIn:'...',
        signedRequest:'...',
        userID:'...'
    }
}

*/

/* facebook login button:

<fb:login-button 
  scope="public_profile,email"
  onlogin="checkLoginState();">
</fb:login-button>

*/

/* facebook check login code

function checkLoginState() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
}
*/

/* facebook custom login button
<div class="fb-login-button" data-width="210" data-size="large" data-button-type="login_with" data-auto-logout-link="false" data-use-continue-as="false"></div>

// place the following code right behind the header (hoofdtekst) tag
<div id="fb-root"></div>
<script async defer crossorigin="anonymous" 
src="https://connect.facebook.net/nl_NL/sdk.js#xfbml=1&version=v6.0&appId=3547734568633665"></script>
*/

/* spinner code while the button is loading

<script>
var finished_rendering = function() {
  console.log("finished rendering plugins");
  var spinner = document.getElementById("spinner");
  spinner.removeAttribute("style");
  spinner.removeChild(spinner.childNodes[0]);
}
FB.Event.subscribe('xfbml.render', finished_rendering);
</script>
<div id="spinner"
    style="
        background: #4267b2;
        border-radius: 5px;
        color: white;
        height: 40px;
        text-align: center;
        width: 250px;">
    Loading
    <div
    class="fb-login-button"
    data-max-rows="1"
    data-size="large"
    data-button-type="continue_with"
    data-use-continue-as="true"
    ></div>
</div>
*/

/*
Settings

In addition to the settings above, you can also change the following:

Setting	HTML5 Attribute	Description	Options
auto_logout_link
data-auto-logout-link
If enabled, the button will change to a logout button when the user is logged in.
false, true
onlogin
data-onlogin
A JavaScript function to trigger when the login process is complete.
Function
scope
data-scope
The list of permissions to request during login.
public_profile (default) or a comma separated list of permissions
size
data-size
Picks one of the size options for the button.
small, medium, large
default_audience
data-default-audience
Determines what audience will be selected by default, when requesting write permissions.
everyone, friends, only_me
*/
