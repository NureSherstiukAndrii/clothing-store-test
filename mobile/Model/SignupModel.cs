using Flurl.Http;
using mobile.Model.Generic;
using Newtonsoft.Json.Linq;

namespace mobile.Model
{
    public static class SignupModel
    {
        public static async Task<JObject> Signup(string name, string password, string mail)
        {
            try
            {
                var link = $"{Config.BASE_URL}/mobileapi/worker";
                var response = await link.PostJsonAsync(new
                {
                    name,
                    password,
                    mail
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