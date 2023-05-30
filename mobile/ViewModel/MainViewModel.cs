using CommunityToolkit.Mvvm.Input;
using mobile.Model;
using mobile.View;
using System.Collections.ObjectModel;

namespace mobile.ViewModel
{
    public partial class MainViewModel : BaseViewModel
    {
        public MainViewModel()
        {
            Search();
        }
        [RelayCommand]
        async void Search()
        {
            await MainModel.GetProducts(Orders);
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