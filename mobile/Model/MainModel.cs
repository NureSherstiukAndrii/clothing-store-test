using Flurl.Http;
using mobile.Model.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Collections.ObjectModel;

namespace mobile.Model
{
    public static class MainModel
    {
        //public static async Task<JObject> GetProductsAsJObject()
        //{
            
        //}
        public static async Task GetProducts(ObservableCollection<Dictionary<string, object>> Orders, 
            string name = null, int min_price = 0, int max_price = 0, bool orderByTotalPrice = false, bool orderByCount = false)
        {
            var callback = async () =>
            {
                try
                {
                    var link = $"{Config.BASE_URL}/mobileapi/orders/available";
                    string accessToken = ApiHandlers.GetAuthDataFromPreferences()["accessToken"].ToString();

                    var responce = await link.WithHeader("authorization", "Bearer " + accessToken).SetQueryParams(new
                    {
                        name,
                        min_price,
                        max_price,
                        orderByTotalPrice = orderByTotalPrice == true ? "true" : null,
                        orderByCount = orderByCount == true ? "true" : null,
                    }).GetAsync();
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
            };

            var resp = await ApiHandlers.RefreshInterceptor(callback);
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