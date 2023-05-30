namespace mobile;

public partial class App : Application
{
	public static int CurrentProductId;
	public App()
	{
		InitializeComponent();

		MainPage = new AppShell();
	}
}
