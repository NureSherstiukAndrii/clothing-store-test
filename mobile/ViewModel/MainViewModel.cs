using CommunityToolkit.Maui.Views;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using mobile.Model;
using mobile.View;
using Newtonsoft.Json.Linq;
using System.Collections.ObjectModel;

namespace mobile.ViewModel
{
    public partial class MainViewModel : BaseViewModel
    {
        #region properties
        [ObservableProperty]
        string _SearchText;
        private int min_price = 0;
        private int max_price = 0;
        private bool orderByTotalPrice = false;
        private bool orderByCount = false;
        #endregion
        public MainViewModel()
        {
            Search();
        }
        [RelayCommand]
        async void Search()
        {
            await MainModel.GetProducts(Orders, SearchText, min_price, max_price, orderByTotalPrice, orderByCount);
        }
        [RelayCommand]
        async void Filters()
        {
            var x = new JObject();

            await AppShell.Current.ShowPopupAsync(new FilterPopupView(x));

            min_price = (int)x["min_price"];
            max_price = (int)x["max_price"];
            orderByTotalPrice = (bool)x["orderByTotalPrice"];
            orderByCount = (bool)x["orderByCount"];

            Search();
        }

        [RelayCommand]
        async void Detail(Dictionary<string, object> order)
        {
            var num = Convert.ToInt32(order["OrderNumber"]);
            App.CurrentProductId = num;
            await AppShell.Current.GoToAsync($"/{nameof(DetailsView)}", true);
        }
        public ObservableCollection<Dictionary<string, object>> Orders { get; set; } = new ObservableCollection<Dictionary<string, object>>();
    }
}