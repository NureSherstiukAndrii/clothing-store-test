using Flurl.Http;
using Newtonsoft.Json.Linq;
using mobile.Model.Generic;

namespace mobile.Model
{
    public static class LoginModel
    {
        public static async Task<JObject> Login(string mail, string password)
        {
            try
            {
                var response = await $"{Config.BASE_URL}/api/login".PostJsonAsync(new
                {
                    mail,
                    password
                });
                var content = await response.ResponseMessage.Content.ReadAsStringAsync();
                var jsonObject = JObject.Parse(content);

                ApiHandlers.SaveUserDataToPreferences(content);
                return ApiHandlers.AddStatusCodeToJObject(jsonObject, 200);
            }
            catch (Exception ex)
            {
                return ApiHandlers.ReturnException(ex);
            }
        }
    }
}