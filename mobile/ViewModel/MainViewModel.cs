using CommunityToolkit.Mvvm.Input;
using mobile.Model;
using System.Collections.ObjectModel;

namespace mobile.ViewModel
{
    public partial class MainViewModel : BaseViewModel
    {
        public MainViewModel()
        {
            SearchCommand();
        }
        [RelayCommand]
        async void SearchCommand()
        {
            await MainModel.GetProducts(Orders);
        }
        public ObservableCollection<Dictionary<string, object>> Orders { get; set; } = new ObservableCollection<Dictionary<string, object>>();
    }
}