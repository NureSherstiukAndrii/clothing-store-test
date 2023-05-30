using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using mobile.Model;

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
            var data = await DetailsModel.GetOrderData(OrderNumber);
        }

        [RelayCommand]
        async void ChangeStatus()
        {

        }

        #region properties
        [ObservableProperty]
        int _OrderNumber;

        [ObservableProperty]
        string _Status;

        [ObservableProperty]
        string _CustomerName;

        [ObservableProperty]
        int _OrderedItemCount;

        [ObservableProperty]
        float _OrderPrice;
        #endregion
    }
}