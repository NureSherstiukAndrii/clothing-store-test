using mobile.Model.Generic;

namespace mobile.Controls;

public partial class FlyoutHeaderControl : StackLayout
{
	public FlyoutHeaderControl()
	{
		InitializeComponent();

        LoadWorkerData();
    }

    public void LoadWorkerData()
    {
        var userData = ApiHandlers.GetAuthDataFromPreferences();
        if (userData != null)
        {
            lblUserName.Text = userData["user"]["name"].ToString();
            lblUserEmail.Text = userData["user"]["mail"].ToString();
        }
    }
}