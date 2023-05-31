using mobile.Controls;
using mobile.Model.Generic;
using mobile.View;

namespace mobile.ViewModel
{
    public partial class LoadingViewModel : BaseViewModel
    {
        public async void CheckAuthorization()
        {
            try
           {
                var x = ApiHandlers.GetAuthDataFromPreferences();
                var userData = await ApiHandlers.GetUserData();
                if ((int)userData["StatusCode"] != 200)
                {
                    await AppShell.Current.GoToAsync($"//{nameof(LoginView)}", true);
                }
                else
                {
                    AppShell.Current.FlyoutHeader =new FlyoutHeaderControl(); 
                    await AppShell.Current.GoToAsync($"//MainPage", true);
                }
            }
            catch (Exception ex)
            {
                await AppShell.Current.DisplayAlert("Error", ex.Message, "OK");
            }
        }
    }
}