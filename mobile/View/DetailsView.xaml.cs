using mobile.ViewModel;

namespace mobile.View;

public partial class DetailsView : ContentPage
{
	public DetailsView(DetailsViewModel viewModel)
	{
		InitializeComponent();
		BindingContext = viewModel;
	}

    private void picker_SelectedIndexChanged(object sender, EventArgs e)
    {
        var picker = (Picker)sender;
        string arg = picker.SelectedItem.ToString();

        ((DetailsViewModel)BindingContext).ChangeStatus(arg);
    }
}