using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Microsoft.Maui.Controls;
using mobile.Model;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Collections.ObjectModel;

namespace mobile.ViewModel
{

    //[QueryProperty("OrderNumber", "orderNumber")]
    public partial class DetailsViewModel : BaseViewModel
    {
        public DetailsViewModel() 
        {
            OrderNumber = App.CurrentProductId;
            LoadDetails();
        }
        async void LoadDetails()
        {
            JObject data = await DetailsModel.GetOrderData(OrderNumber);
            int statusCode = (int)data["StatusCode"];
            if (statusCode != 200)
                return;

            JToken order = data["order"][0];

            Status = order["Status"].ToString();
            CustomerName = order["Customer name"].ToString();
            OrderedItemCount = (int)order["OrderedItemCount"];
            OrderPrice = (float)order["OrderPrice"];

            JArray orderItems = (JArray)data["orderItems"];
            foreach (JObject jsonObject in orderItems)
            {
                var jsonString = jsonObject.ToString();
                Dictionary<string, object> dictionary = JsonConvert.DeserializeObject<Dictionary<string, object>>(jsonString);
                OrderItems.Add(dictionary);
            }
        }

        //[RelayCommand]
        public async void ChangeStatus(string status)
        {
            Status = status;
            await DetailsModel.ChangeStatus(status);
            if (status == "Готово")
                await AppShell.Current.GoToAsync("../");
        }

        #region properties
        [ObservableProperty]
        int _OrderNumber;

        [ObservableProperty]
        string status;

        [ObservableProperty]
        string customerName;

        [ObservableProperty]
        int orderedItemCount;

        [ObservableProperty]
        float orderPrice;

        public ObservableCollection<Dictionary<string, object>> OrderItems { get; set; } = new ObservableCollection<Dictionary<string, object>>();
        #endregion
    }
}