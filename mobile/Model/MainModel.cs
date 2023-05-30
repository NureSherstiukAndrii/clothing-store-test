using Flurl.Http;
using mobile.Model.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Collections.ObjectModel;

namespace mobile.Model
{
    public static class MainModel
    {
        public static async Task<JObject> GetProductsAsJObject()
        {
            try
            {
                var link = $"{Config.BASE_URL}/mobileapi/orders/available";
                string accessToken = ApiHandlers.GetAuthDataFromPreferences()["accessToken"].ToString();
                var responce = await link.WithHeader("authorization", "Bearer " + accessToken).GetAsync();
                var content = await responce.ResponseMessage.Content.ReadAsStringAsync();
                var jsonArray = JArray.Parse(content);

                JObject jsonObject = new JObject
                {
                    { "Orders", jsonArray }
                };

                jsonObject = ApiHandlers.AddStatusCodeToJObject(jsonObject, 200);
                return jsonObject;
            }
            catch (Exception ex)
            {
                return ApiHandlers.ReturnException(ex);
            }
        }
        public static async Task GetProducts(ObservableCollection<Dictionary<string, object>> Orders)
        {
            var resp = await ApiHandlers.RefreshInterceptor(GetProductsAsJObject);
            if ((int)resp["StatusCode"] != 200) return;

            JArray orders = (JArray)resp["Orders"];
            var newOrders = new ObservableCollection<Dictionary<string, object>>();

            foreach (JObject jsonObject in orders)
            {
                var jsonString = jsonObject.ToString();
                Dictionary<string, object> dictionary = JsonConvert.DeserializeObject<Dictionary<string, object>>(jsonString);
                newOrders.Add(dictionary);
            }

            Orders.Clear();
            foreach (var order in newOrders)
            {
                Orders.Add(order);
            }

        }
    }
}