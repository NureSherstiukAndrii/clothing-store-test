namespace mobile;

public partial class App : Application
{
	public static int CurrentProductId;
	public App(AppShell appShell)
	{
		InitializeComponent();

		MainPage = appShell;
    }
}
