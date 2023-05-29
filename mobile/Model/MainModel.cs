using Flurl.Http;
using mobile.Model.Generic;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace mobile.Model
{
    public static class MainModel
    {
        public static async Task<JObject> GetProductsAsJObject()
        {
            try 
            {
                var link = $"{Config.BASE_URL}/mobileapi/orders/available";
                var accessToken = ApiHandlers.GetAuthDataFromPreferences()["accessToken"].ToString();
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
            JArray orders = (JArray)resp["Orders"];
            var newOrders = new ObservableCollection<Dictionary<string, object>>();
            foreach (JObject jsonObject in orders)
            {
                Dictionary<string, object> dictionary = jsonObject.ToObject<Dictionary<string, object>>();
                newOrders.Add(dictionary);
            }

            ApiHandlers.RewriteCollection((ICollection<object>)newOrders, (ICollection<object>)Orders);
        }
    }
}
