<div class="row">
	<div class="col-sm-2 col-xs-12 settings-header">Odnoklassniki SSO</div>
	<div class="col-sm-10 col-xs-12">
		<div class="alert alert-info">
			<ol>
				<li>
					Получить права разработчика на <a href="http://ok.ru/devaccess">соответствующей странице</a>
				</li>
				<li>Добавить приложение с типом external</li>
				<li>Указать в списке "Redirect URI" ссылку на форум с `/auth/ok/callback`</li>
				<li>Заполнить остальные поля</li>
			</ol>
		</div>
		<form role="form" class="sso-ok-settings">
			<div class="form-group">
				<label for="app_id">Application ID</label>
				<input type="text" name="id" title="Application ID" class="form-control input-lg" placeholder="Application ID">
			</div>
			<div class="form-group">
				<label for="public">Публичный ключ приложения</label>
				<input type="text" name="public" title="Публичный ключ приложения" class="form-control" placeholder="Публичный ключ приложения">
			</div>
			<div class="form-group">
				<label for="secret">Секретный ключ приложения</label>
				<input type="text" name="secret" title="Секретный ключ приложения" class="form-control" placeholder="Секретный ключ приложения">
			</div>
			<div class="checkbox">
				<label class="mdl-switch mdl-js-switch mdl-js-ripple-effect">
					<input type="checkbox" class="mdl-switch__input" name="autoconfirm">
					<span class="mdl-switch__label">Skip email verification for people who register using SSO?</span>
				</label>
			</div>
		</form>
	</div>
</div>

<button id="save" class="floating-button mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
	<i class="material-icons">save</i>
</button>
