using mobile.View;

namespace mobile;

public partial class AppShell : Shell
{
	public AppShell()
	{
		InitializeComponent();

		Routing.RegisterRoute(nameof(DetailsView), typeof(DetailsView));
	}
}
