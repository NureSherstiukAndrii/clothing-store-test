using CommunityToolkit.Mvvm.Input;
using mobile.Model.Generic;
using mobile.View;

namespace mobile.ViewModel
{
    public partial class AppShellViewModel : BaseViewModel
    {
        [RelayCommand]
        async void Logout()
        {
            if(Preferences.ContainsKey(Config.PREFERENCES_NAME))
            {
                await ApiHandlers.Logout();
                Preferences.Remove(Config.PREFERENCES_NAME);
                //Preferences.Clear(Config.PREFERENCES_NAME);
                await Shell.Current.GoToAsync($"//{nameof(LoginView)}");
            }
        }
        //if()
    }
}