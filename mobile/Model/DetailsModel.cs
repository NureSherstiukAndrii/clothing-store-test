using Flurl.Http;
using mobile.Model.Generic;
using Newtonsoft.Json.Linq;

namespace mobile.Model
{
    public static class DetailsModel
    {
        public static async Task<JObject> GetOrderAsJObject()
        {
            try
            {
                var link = $"{Config.BASE_URL}/mobileapi/orders/{App.CurrentProductId}";
                string accessToken = ApiHandlers.GetAuthDataFromPreferences()["accessToken"].ToString();
                var responce = await link.WithHeader("authorization", "Bearer " + accessToken).GetAsync();
                var content = await responce.ResponseMessage.Content.ReadAsStringAsync();

                var jsonObject = JObject.Parse(content);
                ApiHandlers.AddStatusCodeToJObject(jsonObject, 200);

                return jsonObject;
            }
            catch (Exception ex)
            {
                return ApiHandlers.ReturnException(ex);
            }
        }
        public static async Task ChangeStatus(string status)
        {
            var callback = async () =>
            {
                var link = $"{Config.BASE_URL}/mobileapi/orders/{App.CurrentProductId}";
                string accessToken = ApiHandlers.GetAuthDataFromPreferences()["accessToken"].ToString();
                var responce = await link.WithHeader("authorization", "Bearer " + accessToken).PatchJsonAsync(new
                {
                    status
                });
                var content = await responce.ResponseMessage.Content.ReadAsStringAsync();

                var jsonObject = JObject.Parse(content);
                ApiHandlers.AddStatusCodeToJObject(jsonObject, 200);

                return jsonObject;
            };

            var resp = await ApiHandlers.RefreshInterceptor(callback);
        }
        public static async Task<JObject> GetOrderData(int id)
        {
            var resp = await ApiHandlers.RefreshInterceptor(GetOrderAsJObject);
            return resp;
        }
    }
}