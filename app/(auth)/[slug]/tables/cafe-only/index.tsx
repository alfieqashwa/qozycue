export function CafeOnly({
  managerAccessLevel,
  cashierAccessLevel,
}: {
  managerAccessLevel: boolean
  cashierAccessLevel: boolean
}) {
  return (
    <div>
      <h2>Cafe Onlyyyy Page ....</h2>
      <div>
        <pre>isManager: {managerAccessLevel.toString()}</pre>
        <pre>isCashier: {cashierAccessLevel.toString()}</pre>
      </div>
    </div>
  )
}
