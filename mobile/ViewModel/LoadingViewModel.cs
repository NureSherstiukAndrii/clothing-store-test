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

            var userData = await ApiHandlers.GetUserData();
            if ((int)userData != 200)
            {
                await AppShell.Current.GoToAsync($"//{nameof(LoginView)}", true);
                }
            }catch (Exception ex)
            {
                await AppShell.Current.DisplayAlert("Error", ex.Message, "OK");
            }
        }
    }
}