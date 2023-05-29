using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using mobile.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
                if ((int)data["StatusCode"] != 200)
                    throw new Exception("Password or email is invalid!");
                await AppShell.Current.DisplayAlert("Success", "", "OK");
            }
            catch (Exception ex)
            {
                await AppShell.Current.DisplayAlert("Error", ex.Message, "OK");
            }
        }
    }
}