using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using mobile.Controls;
using mobile.Model;
using mobile.View;

namespace mobile.ViewModel
{
    public partial class SignupViewModel : BaseViewModel
    {
        #region properties
        [ObservableProperty]
        private string _Name;
        [ObservableProperty]
        private string _Password;
        [ObservableProperty]
        private string _ConfirmPassword;
        [ObservableProperty]
        private string _Email;
        #endregion

        [RelayCommand]
        async void Signup()
        {
            try
            {
                var data = await SignupModel.Signup(_Name, _Password, _Email);

                //if(string.IsNullOrEmpty(_Password)) 


                if ((int)data["StatusCode"] != 200)
                    throw new Exception("Password or email is invalid!");
                //await AppShell.Current.DisplayAlert("Success", "", "OK");
                AppShell.Current.FlyoutHeader = new FlyoutHeaderControl();
                await AppShell.Current.GoToAsync($"//MainPage", true);

            }
            catch (Exception ex)
            {
                await AppShell.Current.DisplayAlert("Error", ex.Message, "OK");
            }
        }
        [RelayCommand]
        async void GoToLogin()
        {
            await AppShell.Current.GoToAsync($"//{nameof(LoginView)}");
        }
    }
}