using Flurl.Http;
using mobile.Model.Generic;
using Newtonsoft.Json.Linq;

namespace mobile.Model
{
    public static class DetailsModel
    {
        //static async Task<JObject> callback(int id)
        //{

        //}
        public static async Task<JObject> GetOrderData(int id)
        {
            var link = $"{Config.BASE_URL}/mobileapi/orders/{id}";
            var clb = async () =>
            {
                string accessToken = ApiHandlers.GetAuthDataFromPreferences()["accessToken"].ToString();
                var responce = await link.WithHeader("authorization", "Bearer " + accessToken).GetAsync();
                var content = await responce.ResponseMessage.Content.ReadAsStringAsync();

                var jsonObject = JObject.Parse(content);
                ApiHandlers.AddStatusCodeToJObject(jsonObject, 200);

                return jsonObject;
            };

            var resp = await ApiHandlers.RefreshInterceptor(clb);
            return resp;
        }
    }
}