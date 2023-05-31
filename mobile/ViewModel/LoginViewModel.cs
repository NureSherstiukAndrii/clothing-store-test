using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using mobile.Controls;
using mobile.Model;
using mobile.View;

namespace mobile.ViewModel
{
    public partial class LoginViewModel : BaseViewModel
    {
        [ObservableProperty]
        string _Email;

        [ObservableProperty]
        string _Password;

        [RelayCommand]
        async void Login()
        {
            try
            {
                if (string.IsNullOrWhiteSpace(_Email) || string.IsNullOrEmpty(_Password))
                    throw new Exception("it is impossible to log in if you did not enter a password or login!");
                var loginData = await LoginModel.Login(_Email, _Password);
                if ((int)loginData["StatusCode"] != 200)
                    throw new Exception("Login error!");
                await AppShell.Current.DisplayAlert("Welcome!",$"Welcome, dear {loginData["user"]["name"]}", "CONTINUE");
                AppShell.Current.FlyoutHeader = new FlyoutHeaderControl();
                await AppShell.Current.GoToAsync($"//MainPage", true);
            }
            catch (Exception ex) 
            {
                await AppShell.Current.DisplayAlert("Error.", ex.Message, "OK");
            }
        }
        [RelayCommand]
        async void GoToRegistration()
        {
            await AppShell.Current.GoToAsync($"//{nameof(SignupView)}");
        }
    }
}